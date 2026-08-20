
import mongoose from "mongoose";
import { Schema } from "mongoose";

const	reviewSchema	=	new	Schema({
product: {	type:	Schema.Types.ObjectId,	ref:	'Product',	required:	true	},				
user: {	type:	Schema.Types.ObjectId,	ref:	'User',	required:	true	},							
rating:	{	type:	Number,	min:	1,	max:	5,	required:	true	},				
comment:{	type:	String	},				
isApproved:	{	type:	Boolean,	default:	false	}
},	{	timestamps:	true	});
reviewSchema.index({	product:	1,	user:	1	},	{	unique:	true	});	//	one	review	per	user	per	product

export const Review = mongoose.model("Review",reviewSchema);










