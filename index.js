import { refresh_modules } from "./modules";
import { data } from "./utils/data";
import { chat } from "./utils/utils";

register('step', () => {
    if (!data.recently_closed) return;
    data.recently_closed = false;
    chat('GUI Closed. Refreshing Modules!')
    refresh_modules();
    data.save()
}).setFps(5)

refresh_modules()