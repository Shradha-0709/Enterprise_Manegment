const SUPABASE_URL = "https://exkdjskxndosmzowvgqd.supabase.co";
const SUPABASE_KEY = "sb_publishable_4hjg1omWiTMlHZ9z2qrhsQ_1mF58JNQ";

// Initialize Supabase Client
let supabaseClient = null;

try {
    if (window.supabase) {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        console.log("Supabase client successfully initialized.");
    } else {
        console.error("Supabase SDK not loaded. Make sure the Supabase CDN is included in index.html.");
    }
} catch (error) {
    console.error("Error initializing Supabase client:", error);
}

// Attach to window object for global availability
window.supabaseClient = supabaseClient;
window.SUPABASE_URL = SUPABASE_URL;
window.SUPABASE_KEY = SUPABASE_KEY;
