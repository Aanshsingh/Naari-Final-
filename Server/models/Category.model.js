
import mongoose from "mongoose"
import { Schema } from "mongoose"

const categorySchema = new Schema({
name: {	type:	String,	required:	true	},
slug: {	type:	String,	required:	true,	unique:	true	},
image: {	type:	String	},
parentCategory: { type: Schema.Types.ObjectId, ref: 'Category', default: null }
  },
  { timestamps: true }
)

export const Category = mongoose.model("Category", categorySchema);