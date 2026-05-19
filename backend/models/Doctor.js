



// import mongoose from "mongoose";

// const doctorSchema = new mongoose.Schema(
//     {
//         name: {
//             type: String,
//             required: [true, "Doctor name is required"],
//             trim: true,
//             minlength: 2,
//             maxlength: 50,
//         },

//         specialization: {
//             type: String,
//             required: [true, "Specialization is required"],
//             trim: true,
//         },

//         experience: {
//             type: Number,
//             required: true,
//             min: 0,
//             max: 60,
//         },

//         fee: {
//             type: Number,
//             required: true,
//             min: 0,
//         },

//         email: {
//     type: String,
//     unique: true,
//     lowercase: true
// },

// phone: {
//     type: String,
//     match: /^[0-9]{10}$/
// },

// available: {
//     type: Boolean,
//     default: true
// },

//         image: {
//             type: String,
//             default: "https://via.placeholder.com/150",
//         },
//     },
//     {
//         timestamps: true, // createdAt + updatedAt
//     }
// );

// // Indexing (fast search ke liye)
// doctorSchema.index({ name: 1 });
// doctorSchema.index({ specialization: 1 });

// export default mongoose.model("Doctor", doctorSchema);







import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Doctor name is required"],
            trim: true,
            minlength: 2,
            maxlength: 50,
        },

        specialization: {
            type: String,
            required: [true, "Specialization is required"],
            trim: true,
        },

        experience: {
            type: Number,
            required: true,
            min: 0,
            max: 60,
        },

        fee: {
            type: Number,
            required: true,
            min: 0,
        },

        email: {
            type: String,
            unique: true,
            lowercase: true
        },

        // ADD THIS
        password: {
            type: String,
            required: true
        },

        phone: {
            type: String,
            match: /^[0-9]{10}$/
        },

        available: {
            type: Boolean,
            default: true
        },

        image: {
            type: String,
            default: "https://via.placeholder.com/150",
        },
    },
    {
        timestamps: true,
    }
);

doctorSchema.index({ name: 1 });
doctorSchema.index({ specialization: 1 });

export default mongoose.model("Doctor", doctorSchema);