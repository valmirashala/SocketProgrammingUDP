import { actions } from "./constants.js";
import mappings from "./permissions.js";


    function Dropdown() {
        return (
        <ul>
          {['ADMIN', 'GUEST'].includes(file.accessLevel) && (
            <li><button type="button">Refresh</button></li>
          )}
          {['ADMIN'].includes(file.accessLevel) && (
            <li><button type="button">Rename</button></li>
          )}
          {['ADMIN'].includes(file.accessLevel) && (
            <li><button type="button">Duplicate</button></li>
          )}
          {file.accessLevel == "ADMIN" && (
            <li><button type="button">Delete</button></li>
          )}
        </ul>
      );}





    function hasPermission(file, action) {
        if (!file?.accessLevel) {
          return false;
        }
      
        if (mappings.has(action)) {
          return mappings.get(action).includes(file.accessLevel);
        }
      
        return false;
      }
      
      export default hasPermission;
      export { actions, roles };