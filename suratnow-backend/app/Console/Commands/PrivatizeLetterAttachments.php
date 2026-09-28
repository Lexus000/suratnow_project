<?php

namespace App\Console\Commands;

use App\Models\LetterRequest;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class PrivatizeLetterAttachments extends Command
{
    protected $signature = 'letters:privatize-attachments {--dry-run : Report files without moving them}';

    protected $description = 'Move existing letter attachments from the public disk to private storage';

    public function handle(): int
    {
        $public = Storage::disk('public');
        $private = Storage::disk('local');
        $moved = 0;
        $missing = 0;

        LetterRequest::query()
            ->whereNotNull('berkas_desa')
            ->select(['id', 'berkas_desa'])
            ->orderBy('id')
            ->cursor()
            ->each(function (LetterRequest $letterRequest) use ($public, $private, &$moved, &$missing): void {
                $path = ltrim((string) $letterRequest->berkas_desa, '/');

                if ($path === '' || str_contains($path, '\\') || preg_match('#(^|/)\.\.(?:/|$)#', $path)) {
                    $this->warn("Skipping unsafe attachment path for request #{$letterRequest->id}");
                    $missing++;
                    return;
                }

                if ($private->exists($path)) {
                    $this->line("Already private: {$path}");
                    return;
                }

                if (!$public->exists($path)) {
                    $this->warn("Missing public attachment: {$path}");
                    $missing++;
                    return;
                }

                if ($this->option('dry-run')) {
                    $this->line("Would move: {$path}");
                    return;
                }

                $private->put($path, $public->get($path));
                $public->delete($path);
                $this->line("Moved: {$path}");
                $moved++;
            });

        $this->info("Attachment migration complete. Moved: {$moved}; missing/skipped: {$missing}.");

        return self::SUCCESS;
    }
}
