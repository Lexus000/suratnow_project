<?php

namespace App\Console\Commands;

use Database\Seeders\E2ESeeder;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;
use PDO;
use PDOException;

class E2eReset extends Command
{
    protected $signature = 'e2e:reset';

    protected $description = 'Reset and seed the isolated end-to-end test database';

    public function handle(): int
    {
        if (!$this->isAllowed()) {
            $this->error('Refusing to mutate the database. E2E reset requires APP_ENV=e2e, E2E_ALLOW_DATABASE_MUTATION=true, and a database name ending in _e2e.');
            return self::FAILURE;
        }

        try {
            $this->ensureDatabaseExists();
            Artisan::call('migrate:fresh', ['--force' => true]);
            $this->line(Artisan::output());
            $this->call('db:seed', ['--class' => E2ESeeder::class, '--force' => true]);
        } catch (PDOException|\Throwable $exception) {
            $this->error('E2E database reset failed: '.$exception->getMessage());
            return self::FAILURE;
        }

        $this->info('E2E database reset and seeded successfully.');
        return self::SUCCESS;
    }

    private function isAllowed(): bool
    {
        $database = (string) config('database.connections.mysql.database');

        return app()->environment('e2e', 'testing')
            && filter_var(env('E2E_ALLOW_DATABASE_MUTATION', false), FILTER_VALIDATE_BOOL)
            && preg_match('/(?:^|_)e2e$/i', $database) === 1;
    }

    private function ensureDatabaseExists(): void
    {
        $connection = config('database.connections.mysql');
        $dsn = sprintf('mysql:host=%s;port=%s;charset=utf8mb4', $connection['host'], $connection['port']);
        $pdo = new PDO($dsn, $connection['username'], $connection['password'], [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);

        $database = (string) $connection['database'];
        $quotedDatabase = '`'.str_replace('`', '``', $database).'`';
        $pdo->exec("CREATE DATABASE IF NOT EXISTS {$quotedDatabase} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    }
}
