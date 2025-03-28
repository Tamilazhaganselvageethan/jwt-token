import mongoose from "mongoose";
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema({
    name:{ type : String, require : true },
    email:{type : String, require : true , unique : true},
    password:{type : String ,require : true},
});
userSchema.pre('save',async function(next){
    if(!this.isModified('password')){
        next()
    }
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password,salt)
})
userSchema.methods.checkPassword = async function(givenPassword){
    return await bcrypt.compare(givenPassword,this.password)
}
const User = mongoose.model("User",userSchema);
export default User;