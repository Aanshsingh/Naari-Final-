
import mongoose from "mongoose";
import { Schema } from "mongoose";
import { Product } from "./Product.model.js";
import { Order } from "./Order.model.js";

const bannerSchema = new Schema({
    title:{type: String, required: true} ,
    Image: {type: String, required: true},
    link:{type:String},
    position:{	type:	String,	enum:	['hero','mid-page','footer'],	default:	'hero'	},
    Order: {type:Number, default:0},
    isActive:{type:Boolean, default:true}
})

export const Banner = mongoose.model("Banner", bannerSchema)

