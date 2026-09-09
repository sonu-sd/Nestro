import mongoose from "mongoose";

const roomschema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        minlength: 4
    },
    slug: {
        type: String,
        unique: true
    },
    image: {
        type: String,
        default:""
    },
    status: {
        type: Boolean,
        default: true
    },
    
}
    , {
        timestamps: true
    }
)

const roomModel = mongoose.model("rooms", roomschema);

export default roomModel;