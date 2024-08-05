const asyncHandler = require('express-async-handler');
const Contact = require('../models/contactModel')

//@desc Get all contacts
//@route GET /api/contacts
//@access Private
const getContacts =asyncHandler(async (req,res)=>{
    const contacts = await Contact.find({user_id: req.user.id})
    res.status(200).json(contacts)
});

//@desc Get  contact
//@route GET /api/contacts/:id
//@access Private
const getContact =asyncHandler(async (req,res)=>{
    const contact = await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("Contact not found")
    }
    res.status(200).json(contact)
});

//@desc create new contacts
//@route POST /api/contacts
//@access Private
const createContact =asyncHandler(async (req,res)=>{
    const {name,email,phone}=req.body;
    if(!name || !email || !phone )
    {
       throw new Error("All fields are mandatory")
    }
    const contact = await Contact.create({
        name,email,phone,user_id:req.user.id
    })
    res.status(200).json(contact)
});

//@desc Update contacts
//@route PUT /api/contacts/:id
//@access Private
const updateContact =asyncHandler(async (req,res)=>{
    const contact = await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("Contact not found")
    }
    if(contact.user.id.toString()!==req.user.id){
        res.status(401);
        throw new Error("User not authorized to update");
    }
    const updatedContact = await Contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new:true,
            runValidators:true
        }
    )
    res.status(200).json(updateContact)
});

//@desc Delete contacts
//@route DELETE /api/contacts/:id
//@access Private
const deleteContact =asyncHandler(async (req,res)=>{
    const contact = await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("Contact not found")
    }
    if(contact.user_id.toString()!==req.user.id){
        res.status(401);
        throw new Error("User not authorized to delete");
    }
    await Contact.deleteOne({_id: req.params.id});
    res.status(200).json({message: `Delete contact for ${req.params.id}`})
});

module.exports = {getContacts,getContact,createContact,updateContact,deleteContact};