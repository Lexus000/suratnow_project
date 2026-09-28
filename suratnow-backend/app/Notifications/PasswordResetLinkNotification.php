<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PasswordResetLinkNotification extends Notification
{
    use Queueable;

    public function __construct(private readonly string $token)
    {
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $email = (string) $notifiable->email;
        $frontendUrl = rtrim((string) config('services.suratnow.frontend_url'), '/');
        $resetUrl = $frontendUrl.'/reset-password?token='.urlencode($this->token).'&email='.urlencode($email);

        return (new MailMessage)
            ->subject('Atur ulang password SuratNow')
            ->greeting('Halo, '.$notifiable->name)
            ->line('Kami menerima permintaan untuk mengatur ulang password akun SuratNow Anda.')
            ->action('Atur Password', $resetUrl)
            ->line('Tautan ini hanya berlaku selama 60 menit dan hanya dapat digunakan satu kali.')
            ->line('Jika Anda tidak meminta perubahan ini, abaikan email ini.');
    }
}
