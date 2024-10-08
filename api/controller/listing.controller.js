import { query } from "express";
import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";

// Create listing
export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

// Delete listing
export const deleteListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, "Listing not found"));
    }

    if (req.user.id !== listing.userRef) {
      return next(errorHandler(401, "Delete your own listing"));
    }

    await Listing.findByIdAndDelete(req.params.id);
    return res.status(200).json("Deleted");
  } catch (error) {
    next(error);
  }
};

// Edit or Update listing

export const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(errorHandler(404, "Listing not found"));
  }
  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, "Delete your own listing"));
  }

  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    return res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};

// Get listing
export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, "Listing not found"));
    }
    return res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

// get listing for search api
export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;

    let offer = req.query.offer;
    if (offer === undefined || offer === "false") {
      offer = { $in: [false, true] };
    }

    let furnished = req.query.furnished;
    if (furnished === undefined || furnished === "false") {
      furnished = { $in: [false, true] };
    }

    let parking = req.query.parking;
    if (parking === undefined || parking === "false") {
      parking = { $in: [false, true] };
    }

    let type = req.query.type;
    if (type === undefined || type === "all") {
      type = { $in: ["rent", "sale"] };
    }

    const searchTerm = req.query.searchTerm || "";

    const sort = req.query.sort || "createdAt";

    const order = req.query.order || "desc";

    // New Filters
    const minArea = parseInt(req.query.minArea) || 0;
    const maxArea = parseInt(req.query.maxArea) || 10000;

    const minYearBuilt = parseInt(req.query.minYearBuilt) || 0;
    const maxYearBuilt = parseInt(req.query.maxYearBuilt) || new Date().getFullYear();

    let propertyType = req.query.propertyType;
    if (propertyType === undefined || propertyType === "all") {
      propertyType = { $in: ["House", "Apartment", "Condo", "Townhouse", "Other"] };
    }

    let amenities = req.query.amenities;
    if (amenities) {
      amenities = { $all: amenities.split(",") };
    } else {
      amenities = undefined;
    }

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: "i" },
      offer,
      furnished,
      parking,
      type,
      area: { $gte: minArea, $lte: maxArea },
      yearBuilt: { $gte: minYearBuilt, $lte: maxYearBuilt },
      propertyType,
      ...(amenities && { amenities }),
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};
