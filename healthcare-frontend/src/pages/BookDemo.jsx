// import React, { useState } from 'react';

// const BookDemo = () => {
//   const [formData, setFormData] = useState({
//     fullName: '',
//     email: '',
//     phone: '',
//     hospitalName: '',
   
//     preferredDate: '',
//     notes: ''
//   });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // यहाँ आपकी API कॉल जाएगी (e.g., Axios.post('/api/demo', formData))
//     console.log("Demo Request Submitted: ", formData);
//     alert("Thank you! Your demo request has been received.");
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
//       <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
//         <span className="text-blue-600 font-semibold tracking-wide uppercase text-sm">Request Access</span>
//         <h2 className="mt-2 text-3xl font-extrabold text-slate-900">
//           Book a Live Demo
//         </h2>
//         <p className="mt-2 text-sm text-slate-600">
//           See how our Hospital Management System can streamline your workflow.
//         </p>
//       </div>

//       <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
//         <div className="bg-white py-8 px-4 shadow-sm border border-slate-200/80 sm:rounded-xl sm:px-10">
//           <form className="space-y-6" onSubmit={handleSubmit}>
            
//             {/* Two Column Row: Name & Email */}
//             <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
//               <div>
//                 <label className="block text-sm font-medium text-slate-700">Full Name</label>
//                 <input
//                   type="text"
//                   name="fullName"
//                   required
//                   value={formData.fullName}
//                   onChange={handleChange}
//                   placeholder="John Doe"
//                   className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-slate-700">Work Email</label>
//                 <input
//                   type="email"
//                   name="email"
//                   required
//                   value={formData.email}
//                   onChange={handleChange}
//                   placeholder="name@hospital.com"
//                   className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                 />
//               </div>
//             </div>

//             {/* Two Column Row: Phone & Hospital Name */}
//             <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
//               <div>
//                 <label className="block text-sm font-medium text-slate-700">Phone Number</label>
//                 <input
//                   type="tel"
//                   name="phone"
//                   required
//                   value={formData.phone}
//                   onChange={handleChange}
//                   placeholder="08960126895"
//                   className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-slate-700">Hospital/Clinic Name</label>
//                 <input
//                   type="text"
//                   name="hospitalName"
//                   required
//                   value={formData.hospitalName}
//                   onChange={handleChange}
//                   placeholder="WeCare Hospital"
//                   className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                 />
//               </div>
//             </div>

//             {/* Two Column Row: Hospital Size & Preferred Date */}
//             <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
//               {/* <div>
//                 <label className="block text-sm font-medium text-slate-700">Hospital Size</label>
//                 <select
//                   name="hospitalSize"
//                   value={formData.hospitalSize}
//                   onChange={handleChange}
//                   className="mt-1 block w-full px-3 py-2 border border-slate-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                 >
//                   <option>1-20 beds</option>
//                   <option>21-100 beds</option>
//                   <option>100+ beds</option>
//                 </select>
//               </div> */}

//               <div>
//                 <label className="block text-sm font-medium text-slate-700">Preferred Demo Date</label>
//                 <input
//                   type="date"
//                   name="preferredDate"
//                   required
//                   value={formData.preferredDate}
//                   onChange={handleChange}
//                   className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                 />
//               </div>
//             </div>

//             {/* Additional Notes */}
//             <div>
//               <label className="block text-sm font-medium text-slate-700">Specific Requirements / Notes</label>
//               <textarea
//                 name="notes"
//                 rows="3"
//                 value={formData.notes}
//                 onChange={handleChange}
//                 placeholder="Tell us about specific features you want to see (e.g., Bed Management, Billing...)"
//                 className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//               ></textarea>
//             </div>

//             {/* Submit Button */}
//             <div>
//               <button
//                 type="submit"
//                 className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
//               >
//                 Schedule Demo
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BookDemo;








import React, { useState } from 'react';
import API from '../utils/api';

const BookDemo = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    hospitalName: '',
    preferredDate: '',
    notes: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 2. पुराने handleSubmit को हटाकर इस असली फंक्शन को यहाँ पेस्ट करें
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post('/demo/book', formData);
      
      if (response.data.success) {
        alert("Demo scheduled successfully!");
        
        // फॉर्म को खाली (Reset) करने के लिए:
        setFormData({ 
          fullName: '', 
          email: '', 
          phone: '', 
          hospitalName: '', 
          preferredDate: '', 
          notes: '' 
        });
      }
    } catch (error) {
      // अगर बैकएंड कोई एरर भेजता है तो उसे अलर्ट में दिखाओ
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <span className="text-blue-600 font-semibold tracking-wide uppercase text-sm">Request Access</span>
        <h2 className="mt-2 text-3xl font-extrabold text-slate-900">
          Book a Live Demo
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          See how our Hospital Management System can streamline your workflow.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-4 shadow-sm border border-slate-200/80 sm:rounded-xl sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {/* Two Column Row: Name & Email */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Work Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@hospital.com"
                  className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Two Column Row: Phone & Hospital Name */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="08960126895"
                  className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Hospital/Clinic Name</label>
                <input
                  type="text"
                  name="hospitalName"
                  required
                  value={formData.hospitalName}
                  onChange={handleChange}
                  placeholder="WeCare Hospital"
                  className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Row: Preferred Date */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700">Preferred Demo Date</label>
                <input
                  type="date"
                  name="preferredDate"
                  required
                  value={formData.preferredDate}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Additional Notes */}
            <div>
              <label className="block text-sm font-medium text-slate-700">Specific Requirements / Notes</label>
              <textarea
                name="notes"
                rows="3"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Tell us about specific features you want to see (e.g., Bed Management, Billing...)"
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              ></textarea>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Schedule Demo
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookDemo;
