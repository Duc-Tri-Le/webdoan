import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    detailUser:{type:Object, default:{}},
    DOB:{type : String, default:""},
    phone:{type:String, default:""},
    mnv: {type:String, default:""},
    role:{type:String, enum:["user","admin","shipper"], default:"user"},
    createAt: {type: Date, default: Date.now },
    updateAT:{type: Date, default: Date.now },
  },
  { minimize: false }
);

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;
