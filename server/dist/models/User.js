import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+@.+\..+/, 'Must use a valid email address'],
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
    },
    // savedBooks is an array of data that adheres to the bookSchema and will be used to populate the User's `savedBooks` field
    savedBooks: [{ type: Schema.Types.ObjectId, ref: 'Book' }],
}, 
// set this to use virtual below
{
    timestamps: true,
    toJSON: { getters: true, virtuals: true },
    toObject: { getters: true },
});
// hash user password
userSchema.pre('save', async function (next) {
    if (this.isNew || this.isModified('password')) {
        const saltRounds = 10;
        this.password = await bcrypt.hash(this.password, saltRounds);
    }
    next();
});
// custom method to compare and validate password for logging in
userSchema.methods.isCorrectPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};
// when we query a user, we'll also get another field called `bookCount` with the number of saved books we have
userSchema.virtual('bookCount').get(function () {
    return this.savedBooks.length;
});
const User = model('User', userSchema);
export default User;
