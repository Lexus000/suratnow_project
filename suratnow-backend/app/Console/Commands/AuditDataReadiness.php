<?php

namespace App\Console\Commands;

use App\Models\LetterRequest;
use App\Models\LetterType;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

/**
 * Read-only inventory for pre-release data hygiene.
 *
 * This command deliberately never deletes or edits database rows. It identifies
 * known demo accounts and obvious demo markers so an operator can review them
 * before publishing the application.
 */
class AuditDataReadiness extends Command
{
    protected $signature = 'data:audit {--json : Output machine-readable JSON}';

    protected $description = 'Audit database and configuration for demo data without changing anything';

    public function handle(): int
    {
        $demoEmails = [
            'superadmin@suruh.go.id',
            'admin@suruh.go.id',
            'warga@gmail.com',
        ];

        $users = User::query()
            ->select(['id', 'name', 'email', 'role', 'is_active', 'password'])
            ->orderBy('id')
            ->get();

        $requests = LetterRequest::query()
            ->select(['id', 'data', 'status'])
            ->orderBy('id')
            ->get();

        $demoUsers = $users->filter(function (User $user) use ($demoEmails): bool {
            $haystack = strtolower($user->name.' '.$user->email);

            return in_array(strtolower((string) $user->email), $demoEmails, true)
                || str_contains($haystack, 'demo')
                || str_contains($haystack, 'dummy')
                || str_contains($haystack, 'simulasi');
        })->values()->map(fn (User $user): array => [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'active' => (bool) $user->is_active,
            'weak_password' => collect(['password123', 'password', '12345678'])
                ->contains(fn (string $candidate): bool => Hash::check($candidate, (string) $user->password)),
        ])->all();

        $demoRequests = $requests->filter(function (LetterRequest $request): bool {
            $data = json_encode($request->data ?? [], JSON_UNESCAPED_UNICODE) ?: '';
            $haystack = strtolower($data);

            return str_contains($haystack, 'demo')
                || str_contains($haystack, 'dummy')
                || str_contains($haystack, 'simulasi')
                || str_contains($haystack, 'mock');
        })->values()->map(fn (LetterRequest $request): array => [
            'id' => $request->id,
            'status' => $request->status,
        ])->all();

        $result = [
            'environment' => app()->environment(),
            'debug' => (bool) config('app.debug'),
            'seed_demo_accounts' => (bool) config('app.seed_demo_accounts'),
            'counts' => [
                'users' => $users->count(),
                'letter_types' => LetterType::query()->count(),
                'letter_requests' => $requests->count(),
            ],
            'demo_users' => $demoUsers,
            'demo_requests' => $demoRequests,
            'notes' => [
                'This is a read-only audit.',
                'Existing rows are not changed or removed.',
                'Production should use named operator accounts and a separate migration/approval process for any cleanup.',
            ],
        ];

        if ($this->option('json')) {
            $this->line((string) json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
            return self::SUCCESS;
        }

        $this->info('SuratNow data readiness audit (read-only)');
        $this->table(['Metric', 'Value'], [
            ['Environment', $result['environment']],
            ['Debug', $result['debug'] ? 'ON' : 'OFF'],
            ['Demo seeder', $result['seed_demo_accounts'] ? 'ON' : 'OFF'],
            ['Users', $result['counts']['users']],
            ['Letter types', $result['counts']['letter_types']],
            ['Letter requests', $result['counts']['letter_requests']],
            ['Suspected demo users', count($demoUsers)],
            ['Suspected demo requests', count($demoRequests)],
        ]);

        if ($demoUsers !== []) {
            $this->warn('Suspected demo users found:');
            $this->table(['ID', 'Name', 'Email', 'Role', 'Active', 'Weak password'], array_map(
                fn (array $user): array => [$user['id'], $user['name'], $user['email'], $user['role'], $user['active'] ? 'yes' : 'no', $user['weak_password'] ? 'YES' : 'no'],
                $demoUsers
            ));
        }

        if ($demoRequests !== []) {
            $this->warn('Suspected demo requests found:');
            $this->table(['ID', 'Status'], array_map(
                fn (array $request): array => [$request['id'], $request['status']],
                $demoRequests
            ));
        }

        if ($result['environment'] === 'production' && $result['debug']) {
            $this->error('APP_DEBUG is enabled in production. Fix deployment configuration before publishing.');
            return self::FAILURE;
        }

        return self::SUCCESS;
    }
}
