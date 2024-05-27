import Like_Form from "../components/like";
export default async function Like() {
  return (
    <>
      <div className="flex gap-5 h-12 items-center justify-center">
        <p className="text=xl md:text-2xl px-5 py-1 border-s-3 border-e-3 border-primary bg-gradient-to-t from-primary rounded-md">ระบบเพิ่มไลค์คนไทย Facebook</p>
      </div>
      <div className="flex justify-center items-center mt-5">
        <Like_Form />
      </div>
    </>
  );
}
