
export interface CTRPredictionInput {
    niche: string;
    adGoal: string;
    headline: string;
}

export const predictCTR = (data: CTRPredictionInput): string => {
    const { niche, adGoal } = data;

    // Base CTR range by niche (approximate industry standards)
    const nicheBase: Record<string, number> = {
        "Restaurant": 2.5,
        "Software": 1.8,
        "E-commerce": 2.2,
        "Health & Fitness": 2.0,
        "Education Technology": 1.5,
        "Travel Agency": 2.8,
        "Real Estate": 1.6,
        "Fashion": 2.4,
        "Other": 1.5
    };

    let baseRate = nicheBase[niche] || nicheBase["Other"];

    // Goal modifiers
    if (adGoal.toLowerCase().includes("awareness")) baseRate -= 0.2;
    else if (adGoal.toLowerCase().includes("lead")) baseRate += 0.3;
    else if (adGoal.toLowerCase().includes("sale")) baseRate += 0.5;

    // Random variation to make it look realistic (+- 0.5%)
    const variation = (Math.random() * 1.0) - 0.5;

    const predicted = Math.max(0.1, baseRate + variation); // Ensure non-negative

    return `${predicted.toFixed(2)}%`;
};
