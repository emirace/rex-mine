/* eslint-disable react/prop-types */
function ServiceCard({ header, icon, description, number }: any) {
  return (
    <div className="shadow-lg p-4 cursor-pointer rounded-md group hover:bg-primary">
      <div className="flex items-center justify-between">
        {icon}
        <p className="text-6xl opacity-[0.1] group-hover:text-white">
          {number}
        </p>
      </div>

      <h2 className="text-2xl font-bold uppercase leading-loose group-hover:text-white">
        {header}
      </h2>
      <p className="text-sm md:text-lg  leading-loose mt-4 group-hover:text-white">
        {description}
      </p>
    </div>
  );
}

export default ServiceCard;
