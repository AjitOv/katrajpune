export default function BrandLogo() {
  return (
    <span className="brand-lockup flex items-center gap-2.5">
      <img
        src="/brand-mark.svg"
        width="38"
        height="38"
        alt="KatrajPune"
        className="rounded-xl shadow-sm shrink-0"
      />
      <span className="brand-name flex flex-col justify-center">
        <span className="text-xl font-black tracking-tight text-[#0F172A] leading-none">
          Katraj<span className="text-orange">Pune</span><span className="text-xs font-bold text-gray-400">.com</span>
        </span>
        <small className="text-[8.5px] font-black tracking-widest text-gray-400 uppercase mt-1">
          Verified Business Directory
        </small>
      </span>
    </span>
  )
}
