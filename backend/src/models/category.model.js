import mongoose from "mongoose";

const categoryschema = new mongoose.Schema({
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

const categoryModel = mongoose.model("categories", categoryschema);

export default categoryModel;