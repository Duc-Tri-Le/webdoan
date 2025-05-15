import express from "express"
import { addFood, list_food, remove_food,update_food, detail_food, search_food, addReview, recommendationFood } from "../controllers/foodController.js"
import multer from "multer"
import { authMiddleware, authorizeRoles } from "../middleware/auth.js";

const foodRouter = express.Router();

//image storage engine

const storage = multer.diskStorage({
    destination:"uploads",
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()}-${file.originalname}`)
    }
})

const upload = multer({storage:storage})
//admin
foodRouter.post("/add",authMiddleware, authorizeRoles("admin"),upload.single("image"), addFood)
foodRouter.delete("/remove-food/:id",authMiddleware, authorizeRoles("admin"), remove_food)
foodRouter.put("/update-food/:id",authMiddleware, authorizeRoles("admin"),upload.single("image"),update_food)
foodRouter.post("/recommendation",authMiddleware,authorizeRoles("admin"),recommendationFood)
//user
foodRouter.patch("/add-review/:id",authMiddleware, authorizeRoles("user"), addReview)

//all
foodRouter.get("/search-food", search_food)
foodRouter.get("/detail-food/:id",detail_food)
foodRouter.get("/list-food", list_food)

export default foodRouter;