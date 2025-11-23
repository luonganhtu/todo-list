import { Link } from "react-router-dom";
import aiContractImg from "../../assets/images/ai-contract-img.png";
export default function Hero() {
  return (
    <section className="w-full min-h-[calc(100vh-80px)] bg-[#e8f9ef] flex items-center">
      <div className="max-w-7xl mx-auto px-8 lg:px-[10vw] py-20 flex flex-col lg:flex-row items-center justify-between gap-12">
        <div className="lg:w-1/2 space-y-8 flex flex-col items-start">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1E603F] leading-tight">
            Danh sách công việc của bạn
          </h1>
          <p className="text-lg md:text-xl text-[#1E603F] opacity-80 leading-relaxed max-w-lg">
            Quản lý công việc của bạn một cách hiệu quả và dễ dàng.
          </p>
          <div className="flex flex-wrap gap-4 mt-4">
            {/* <Link
              to="/dashboard"
              className="px-6 py-3 bg-[#1E603F] text-white rounded-lg font-semibold hover:bg-[#15532f] transition cursor-pointer shadow-md"
            >
              Bảng điều khiển
            </Link> */}
            <Link
              to="/task"
              className="px-6 py-3 border-2 border-[#1E603F] text-[#1E603F] bg-white rounded-lg font-semibold hover:bg-[#1E603F] hover:text-white transition cursor-pointer"
            >
              Tạo Công Việc
            </Link>
          </div>
        </div>
        <div className="lg:w-1/2 flex items-center justify-center">
          <img
            src={aiContractImg}
            alt="AI Contract Analysis"
            className="w-full max-w-2xl h-auto object-contain"
          />
        </div>
      </div>
    </section>
  );
}
