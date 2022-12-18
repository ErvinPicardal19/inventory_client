import useAxiosPrivate from "./useAxiosPrivate"

const useInvetoryServices = () => {
   const axiosPrivate = useAxiosPrivate();

   const addNewProduct = async(data) => {
      try {
         const response = await axiosPrivate.post('/inventory', JSON.stringify(data));

         return response;
      } catch(err) {
         console.error(err);
      }
   }

   const updateProduct = async(data) => {
      try {
         const response = await axiosPrivate.put(`/inventory/${data._id}`, JSON.stringify(data));

         return response;
      } catch(err) {
         console.error(err);
      }
   }

   const deleteProduct = async(data) => {
      try {
         for(let x in data){
            await axiosPrivate.delete(`/inventory/${data[x]._id}`);
         }

      } catch(err) {
         console.error(err);
      }
   }
   

  return {
   addNewProduct,
   updateProduct,
   deleteProduct
  }
}

export default useInvetoryServices;