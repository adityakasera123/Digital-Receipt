const AuthHeader = ({ title, subtitle }) => {
  return (
    <div className="mb-10">
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Billvora
        </h2>
      </div>

      <h1 className="text-[34px] leading-[1.05] tracking-tight font-bold tracking-tight text-slate-900">
        {title}
      </h1>

      <p className="mt-3 text-base leading-7 text-slate-500">
        {subtitle}
      </p>
    </div>
  );
};

export default AuthHeader;