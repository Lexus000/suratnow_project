<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('letter_requests', function (Blueprint $table): void {
            $table->unique('nomor_registrasi', 'letter_requests_nomor_registrasi_unique');
        });
    }

    public function down(): void
    {
        Schema::table('letter_requests', function (Blueprint $table): void {
            $table->dropUnique('letter_requests_nomor_registrasi_unique');
        });
    }
};
