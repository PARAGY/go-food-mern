import React from "react";

export default function NutritionInfo({ nutrition }) {
  if (!nutrition) return null;

  // Modern grid layout for nutrition
  const items = [
    { label: "Cals", value: nutrition.calories || nutrition.Calories },
    { label: "Prot", value: nutrition.protein || nutrition.Protein },
    { label: "Carb", value: nutrition.carbs || nutrition.Carbs },
    { label: "Fat", value: nutrition.fat || nutrition.Fat },
  ];

  return (
    <div className="bg-gray-800/50 rounded-xl p-2 mb-3 border border-gray-700/50">
      <div className="grid grid-cols-4 gap-1">
        {items.map((item, i) => (
          <div key={i} className="text-center border-r last:border-r-0 border-gray-700/50 px-1">
            <p className="text-[10px] text-gray-400 font-bold uppercase leading-tight">{item.label}</p>
            <p className="text-[11px] text-green-400 font-black truncate">{item.value || "-"}</p>
          </div>
        ))}
      </div>
      {(nutrition.fiber || nutrition.vitamins) && (
        <div className="mt-2 pt-2 border-t border-gray-700/50 flex justify-between px-1">
             {nutrition.fiber && <span className="text-[9px] text-gray-400 italic">Fiber: {nutrition.fiber}</span>}
             {nutrition.vitamins && <span className="text-[9px] text-gray-400 italic">Vits: {nutrition.vitamins}</span>}
        </div>
      )}
    </div>
  );
}
