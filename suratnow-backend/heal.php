<?php

// This legacy repair helper must never be exposed or executed through the web root.
// Data repairs belong in reviewed, authenticated Artisan commands.
http_response_code(404);
exit('Not found');
