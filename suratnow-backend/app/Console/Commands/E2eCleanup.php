<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Storage;

class E2eCleanup extends Command
{
    protected $signature = 'e2e:cleanup';

    protected $description = 'Clean the isolated end-to-end test database and uploaded files';

    public function handle(): int
    {
        $database = (string) config('database.connections.mysql.database');
        $allowed = app()->environment('e2e', 'testing')
            && filter_var(env('E2E_ALLOW_DATABASE_MUTATION', false), FILTER_VALIDATE_BOOL)
            && preg_match('/(?:^|_)e2e$/i', $database) === 1;

        if (!$allowed) {
            $this->error('Refusing to clean the database outside the isolated E2E environment.');
            return self::FAILURE;
        }

        Storage::disk('local')->deleteDirectory('berkas_desa');
        Artisan::call('migrate:fresh', ['--force' => true]);
        $this->line(Artisan::output());
        $this->info('E2E database and files cleaned.');

        return self::SUCCESS;
    }
}
