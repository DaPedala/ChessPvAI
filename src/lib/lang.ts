export type Lang = 'en' | 'ro';

export const t = {
    en: {
        // Nav
        nav_features:    'Features',
        nav_how:         'How it works',
        nav_about:       'About',
        nav_history:     'History',
        nav_leaderboard: 'Leaderboard',
        nav_play:        'Play now →',
        nav_home:        '← Home',
        nav_login:       'Log in',
        nav_register:    'Sign up',
        nav_logout:      'Log out',

        // Hero
        hero_kicker:   'Stockfish · Real-time Analysis · Fischer Clock',
        hero_title_1:  'Chess,',
        hero_title_2:  'the way it',
        hero_title_3:  'should be.',
        hero_sub:      'Play against a world-class engine. Get immediate move-by-move feedback. Every game logged. No accounts, no fuss.',
        hero_btn_play: 'Start playing',
        hero_btn_feat: 'See features ↓',

        // Stats
        stat_rating:   'Stockfish rating',
        stat_controls: 'Time controls',
        stat_cats:     'Move categories',

        // Features
        feat_1_title: 'Stockfish Engine',
        feat_1_desc:  'Play against one of the strongest chess engines in the world — from beginner-friendly to maximum strength.',
        feat_2_title: 'Move Analysis',
        feat_2_desc:  'Every move you play is evaluated in real time. Best, good, inaccuracy, mistake, blunder — know exactly where you stand.',
        feat_3_title: 'Full Time Controls',
        feat_3_desc:  'Bullet, blitz, rapid, classical, or a custom setup. Fischer increment supported across all modes.',
        feat_4_title: 'Match Export',
        feat_4_desc:  'All games are automatically logged and exported at the end of each match for review and history tracking.',

        // Steps
        step_1_title: 'Configure',
        step_1_desc:  'Set your username, pick a time control, choose your side and AI difficulty.',
        step_2_title: 'Play',
        step_2_desc:  'Click or drag pieces on the board. The clock starts on your first move.',
        step_3_title: 'Review',
        step_3_desc:  'After the game, step through every move with eval scores and categories.',

        // About
        about_quote: 'Chess is not about the destination — it\'s about the moves you understand along the way.',
        about_p1:    'ChessApp is a passion project built on top of <strong>Stockfish 18</strong>, the strongest open-source chess engine in existence, and <strong>chess.js</strong> for move validation. The interface is written in <strong>SvelteKit</strong> with a focus on feel — responsive controls, real-time evaluation, and a clean post-game review.',
        about_p2:    'No servers required for gameplay. Everything runs in your browser. Your moves are yours.',
        about_btn:   'Open the board →',

        // Section headers
        sec_features: '/ FEATURES',
        sec_feat_h:   'Built for serious play.',
        sec_how:      '/ HOW IT WORKS',
        sec_how_h:    'Three moves to a match.',
        sec_about:    '/ ABOUT',

        // History page
        hist_title:     'Game History',
        hist_back:      '← Back to game',
        hist_loading:   'Loading…',
        hist_empty:     'No games saved yet.',
        hist_all:       '← All games',
        hist_start:     'Starting position',
        hist_result:    'Result',
        hist_time:      'Time Control',
        hist_avgcpl:    'avgCPL',
        hist_moves:     'Moves',
        hist_played:    'Played',
        hist_analysis:  'Move Analysis',

        // Leaderboard page
        lb_title:    'Leaderboard',
        lb_back:     '← Back to home',
        lb_subtitle: 'Ranked by win rate across all matches.',
        lb_loading:  'Loading…',
        lb_empty:    'No games recorded yet.',
        lb_rank:     '#',
        lb_player:   'Player',
        lb_games:    'Games',
        lb_wins:     'Wins',
        lb_winrate:  'Win Rate',
        lb_avgmoves: 'Avg Moves',
        lb_skill:    'Skill Range',

        // Footer
        footer_built: 'Built with Stockfish · chess.js · SvelteKit',

        // Language dropdown
        language: 'Language',

        // GameMenu
        menu_username:     'Username',
        menu_ai_strength:  'AI Strength',
        menu_maximum:      'Maximum',
        menu_beginner:     'Beginner',
        menu_level:        'Level',
        menu_play_as:      'Play as',
        menu_playing_as:   'Playing as',
        menu_white:        'White',
        menu_random:       'Random',
        menu_black:        'Black',
        menu_custom_title: 'Custom time control',
        menu_minutes:      'Minutes per side',
        menu_increment:    'Increment (seconds)',
        menu_cancel:       'Cancel',
        menu_start:        'Start game',

        // GameClock
        clock_engine:      'Engine',

        // MoveLog
        log_title:         'Move Analysis',
        log_move_of:       'of',
        log_live:          '↩ Live',
        log_empty:         'No moves yet',

        // PostGame
        pg_rematch:        'Rematch',
        pg_new_game:       'New game',

        // Play page
        play_abort:        'Abort & return to menu',

        // Constants
        tc_bullet: 'Bullet',
        tc_blitz: 'Blitz',
        tc_rapid: 'Rapid',
        tc_classical: 'Classical',
        tc_custom: 'Custom',

        // Game Store
        status_awaiting:   'Awaiting Configuration',
        status_your_turn:  'Your turn',
        status_ai_thinking:'AI is thinking…',
        status_evaluating: 'Evaluating…',
        status_checkmate:  'Checkmate!',
        status_draw:       'Draw!',
        status_game_over:  'Game Over',
        status_timeout_ai: 'Timeout: AI Wins',
        status_timeout_player: 'Timeout: Player Wins',
        alert_username:    'Identity required before starting a game.',

        // Auth pages
        auth_email:            'Email',
        auth_display_name:     'Display name',
        auth_password:         'Password',
        auth_confirm_password: 'Confirm password',
        auth_register_title:   'Create account',
        auth_register_sub:     'Start tracking your games.',
        auth_register_btn:     'Create account',
        auth_login_title:      'Welcome back',
        auth_login_sub:        'Log in to continue playing.',
        auth_login_btn:        'Log in',
        auth_have_account:     'Already have an account?',
        auth_login_link:       'Log in',
        auth_no_account:       'No account yet?',
        auth_register_link:    'Sign up',

        // Account page
        acc_title:            'Account',
        acc_back:             'Back to game',
        acc_display_name:     'Display name',
        acc_display_name_desc:'This is the name shown on the leaderboard and in game history. Must be unique.',
        acc_password:         'Password',
        acc_password_desc:    'Change your login password.',
        acc_current_pass:     'Current password',
        acc_new_pass:         'New password',
        acc_confirm_pass:     'Confirm new password',
        acc_save:             'Save',
        acc_name_saved:       'Display name updated.',
        acc_pass_saved:       'Password updated.',
    },

    ro: {
        // Nav
        nav_features:    'Funcții',
        nav_how:         'Cum funcționează',
        nav_about:       'Despre',
        nav_history:     'Istoric',
        nav_leaderboard: 'Clasament',
        nav_play:        'Joacă acum →',
        nav_home:        '← Acasă',
        nav_login:       'Autentificare',
        nav_register:    'Înregistrare',
        nav_logout:      'Deconectare',

        // Hero
        hero_kicker:   'Stockfish · Analiză în timp real · Ceas Fischer',
        hero_title_1:  'Șah,',
        hero_title_2:  'așa cum ar',
        hero_title_3:  'trebui să fie.',
        hero_sub:      'Joacă împotriva unui motor de șah de top mondial. Primești feedback imediat pentru fiecare mutare. Fiecare partidă este salvată. Fără conturi, fără bătăi de cap.',
        hero_btn_play: 'Începe să joci',
        hero_btn_feat: 'Vezi funcțiile ↓',

        // Stats
        stat_rating:   'Elo Stockfish',
        stat_controls: 'Moduri de timp',
        stat_cats:     'Categorii de mutări',

        // Features
        feat_1_title: 'Motor Stockfish',
        feat_1_desc:  'Joacă împotriva unuia dintre cele mai puternice motoare de șah din lume — de la nivel de începător până la forță maximă.',
        feat_2_title: 'Analiza mutărilor',
        feat_2_desc:  'Fiecare mutare este evaluată în timp real: excelentă, bună, inexactitate, greșeală sau gafă — vezi exact unde ai greșit.',
        feat_3_title: 'Toate modurile de timp',
        feat_3_desc:  'Bullet, blitz, rapid, clasic sau personalizat. Incrementul Fischer este suportat în toate modurile.',
        feat_4_title: 'Exportul partidei',
        feat_4_desc:  'Toate partidele sunt salvate și exportate automat la final pentru revizuire și urmărirea istoricului.',

        // Steps
        step_1_title: 'Configurează',
        step_1_desc:  'Setează-ți numele de utilizator, alege un control de timp, partea și dificultatea AI.',
        step_2_title: 'Joacă',
        step_2_desc:  'Apasă sau trage piesele pe tablă. Ceasul pornește la prima mutare.',
        step_3_title: 'Analizează',
        step_3_desc:  'După partidă, analizează fiecare mutare cu scoruri de evaluare și categorii.',

        // About
        about_quote: 'Șahul nu este despre destinație — ci despre mutările pe care le înțelegi pe drum.',
        about_p1:    'ChessApp este un proiect de suflet construit pe <strong>Stockfish 18</strong>, cel mai puternic motor de șah open-source, și <strong>chess.js</strong> pentru validarea mutărilor. Interfața este scrisă în <strong>SvelteKit</strong> cu accent pe experiență — controale responsive, evaluare în timp real și o revizuire clară după partidă.',
        about_p2:    'Nu sunt necesare servere pentru joc. Totul rulează în browserul tău. Mutările tale îți aparțin.',
        about_btn:   'Deschide tabla →',

        // Section headers
        sec_features: '/ FUNCȚII',
        sec_feat_h:   'Construit pentru joc serios.',
        sec_how:      '/ CUM FUNCȚIONEAZĂ',
        sec_how_h:    'Trei pași până la o partidă.',
        sec_about:    '/ DESPRE',

        // History page
        hist_title:    'Istoric partide',
        hist_back:     '← Înapoi la joc',
        hist_loading:  'Se încarcă…',
        hist_empty:    'Nicio partidă salvată încă.',
        hist_all:      '← Toate partidele',
        hist_start:    'Poziție de start',
        hist_result:   'Rezultat',
        hist_time:     'Control de timp',
        hist_avgcpl:   'CPL mediu',
        hist_moves:    'Mutări',
        hist_played:   'Jucat',
        hist_analysis: 'Analiza mutărilor',

        // Leaderboard page
        lb_title:    'Clasament',
        lb_back:     '← Înapoi acasă',
        lb_subtitle: 'Ordonat după rata de victorii din toate partidele.',
        lb_loading:  'Se încarcă…',
        lb_empty:    'Nicio partidă înregistrată.',
        lb_rank:     '#',
        lb_player:   'Jucător',
        lb_games:    'Partide',
        lb_wins:     'Victorii',
        lb_winrate:  'Rată de victorii',
        lb_avgmoves: 'Număr mediu de mutări',
        lb_skill:    'Dificultate AI',

        // Footer
        footer_built: 'Construit cu Stockfish · chess.js · SvelteKit',
        
        // Language dropdown
        language: 'Limbă',

        // GameMenu
        menu_username:     'Nume utilizator',
        menu_ai_strength:  'Putere AI',
        menu_maximum:      'Maxim',
        menu_beginner:     'Începător',
        menu_level:        'Nivel',
        menu_play_as:      'Joacă ca',
        menu_playing_as:   'Joci ca',
        menu_white:        'Alb',
        menu_random:       'Aleatoriu',
        menu_black:        'Negru',
        menu_custom_title: 'Control de timp personalizat',
        menu_minutes:      'Minute per jucător',
        menu_increment:    'Increment (secunde)',
        menu_cancel:       'Anulează',
        menu_start:        'Începe jocul',

        // GameClock
        clock_engine:      'Motor',

        // MoveLog
        log_title:         'Analiza mutărilor',
        log_move_of:       'din',
        log_live:          '↩ Live',
        log_empty:         'Nicio mutare încă',

        // PostGame
        pg_rematch:        'Revanșă',
        pg_new_game:       'Joc nou',

        // Play page
        play_abort:        'Abandonează și revino',

        // Constants
        tc_bullet: 'Bullet',
        tc_blitz: 'Blitz',
        tc_rapid: 'Rapid',
        tc_classical: 'Clasic',
        tc_custom: 'Custom',

        // Game Store
        status_awaiting:   'Așteptând configurare',
        status_your_turn:  'Rândul tău',
        status_ai_thinking:'Motorul se gândește…',
        status_evaluating: 'Se evaluează…',
        status_checkmate:  'Șah mat!',
        status_draw:       'Remiză!',
        status_game_over:  'Joc terminat',
        status_timeout_ai: 'Timp expirat: Motorul câștigă',
        status_timeout_player: 'Timp expirat: Jucătorul câștigă',
        alert_username:    'Nume de utilizator necesar înainte de a începe.',

        // Auth pages
        auth_email:            'Email',
        auth_display_name:     'Nume afișat',
        auth_password:         'Parolă',
        auth_confirm_password: 'Confirmă parola',
        auth_register_title:   'Creează cont',
        auth_register_sub:     'Începe să îți urmărești partidele.',
        auth_register_btn:     'Creează cont',
        auth_login_title:      'Bine ai revenit',
        auth_login_sub:        'Autentifică-te pentru a continua.',
        auth_login_btn:        'Autentificare',
        auth_have_account:     'Ai deja cont?',
        auth_login_link:       'Autentificare',
        auth_no_account:       'Nu ai cont?',
        auth_register_link:    'Înregistrează-te',

        // Account page
        acc_title:            'Cont',
        acc_back:             'Înapoi la joc',
        acc_display_name:     'Nume afișat',
        acc_display_name_desc:'Acesta este numele afișat pe clasament și în istoricul partidelor. Trebuie să fie unic.',
        acc_password:         'Parolă',
        acc_password_desc:    'Schimbă parola de autentificare.',
        acc_current_pass:     'Parola curentă',
        acc_new_pass:         'Parolă nouă',
        acc_confirm_pass:     'Confirmă parola nouă',
        acc_save:             'Salvează',
        acc_name_saved:       'Nume afișat actualizat.',
        acc_pass_saved:       'Parolă actualizată.',
    }
} satisfies Record<Lang, Record<string, string>>;