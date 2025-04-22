namespace Nautilux_Auctions.Domain.Enums;

public enum ListingCondition
{
    /// <summary>Severely damaged or corroded, barely recognizable.</summary>
    Ruined,

    /// <summary>Heavy corrosion, missing parts, structurally compromised.</summary>
    Poor,

    /// <summary>Noticeable wear, surface corrosion, but intact and identifiable.</summary>
    Fair,

    /// <summary>Minor wear and weathering, overall good condition for its age.</summary>
    Good,

    /// <summary>Well-preserved with minimal signs of exposure, collectible quality.</summary>
    VeryGood,

    /// <summary>Excellent preservation or restoration, museum-quality piece.</summary>
    Excellent
}