// Configuración Supabase de AntalVac
const SUPABASE_URL = "https://bswzelbrwcbkppteegpf.supabase.co";

// IMPORTANTE:

const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_TZmtWigR5f2DVq-cyU_JPg_GywEho69";

const cliente = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);
