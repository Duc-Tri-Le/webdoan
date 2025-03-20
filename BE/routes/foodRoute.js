import express from "express"
import { addFood, list_food, remove_food,update_food, detail_food, search_food, addReview } from "../controllers/foodController.js"
import multer from "multer"
import { authMiddleware } from "../middleware/auth.js";

const foodRouter = express.Router();

//image storage engine

const storage = multer.diskStorage({
    destination:"uploads",
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()}-${file.originalname}`)
    }
})

const upload = multer({storage:storage})

foodRouter.post("/add",upload.single("image"), addFood)
foodRouter.get("/list-food", list_food)
foodRouter.delete("/remove-food/:id", remove_food)
foodRouter.put("/update-food/:id",update_food)
foodRouter.get("/detail-food/:id",detail_food)
foodRouter.get("/search-food", search_food)
foodRouter.patch("/add-review/:id",authMiddleware, addReview)








export default foodRouter;