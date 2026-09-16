import mongoose from "mongoose";

const categoryschema = new mongoose.Schema({
    name: {
        type: String,
        required:true,
        unique: true,
        minlength: 2,
        trim:true
    },
    slug: {
        type: String,
        unique: true,
        required:true,
        lowercase:true,
        trim:true
    },
    image: {
        type: String,
        default:""
    },
    imagePublicId:{ type:String, default:"", select:false },
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
