import { actions } from "./constants.js";

const mappings = new Map();

mappings.set(actions.MODIFY_FILE, [roles.ADMIN]);
mappings.set(actions.VIEW_FILE, [roles.ADMIN, roles.GUEST]);
mappings.set(actions.EXECUTE_FILE, [roles.ADMIN]);
mappings.set(actions.CREATE_FILE, [roles.ADMIN]);

