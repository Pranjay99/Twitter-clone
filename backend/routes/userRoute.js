import express from "express"
import isAuthenticated from "../config/auth.js";
import { Login, Register, logout,bookmarks, getMyProfile, getOtherUsers, follow, unfollow, updateProfile} from "../controlers/userController.js";

const router = express.Router();

router.route("/register").post(Register);
router.route("/login").post(Login);
router.route("/logout").get(logout);
router.route("/bookmark/:id").put(bookmarks);
router.route("/profile/:id").get(getMyProfile);
router.route("/otheruser/:id").get(getOtherUsers);
router.route("/follow/:id").post(follow);
router.route("/unfollow/:id").post(unfollow);
router.route("/updateprofile/:id").put(updateProfile);









export default router;
