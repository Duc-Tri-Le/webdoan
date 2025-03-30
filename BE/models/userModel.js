import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    detailUser:{type:Object, default:{}},
    DOB:{type : String, default:""},
    phone:{type:String, default:""},
    role:{type:String, enum:["user","admin","shipper"], default:"user"}
  },
  { minimize: false }
);

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;
