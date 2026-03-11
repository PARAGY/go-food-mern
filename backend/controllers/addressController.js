import Address from "../models/Address.js";
import User from "../models/User.js";

// @route   POST /api/address
// @desc    Add a new address
// @access  Private
export const addAddress = async (req, res) => {
  try {
    const { fullName, phone, houseNumber, street, area, city, state, pincode, label } = req.body;
    
    const newAddress = await Address.create({
      user: req.user.id,
      fullName,
      phone,
      houseNumber,
      street,
      area,
      city,
      state,
      pincode,
      label
    });

    // Add reference to User model
    await User.findByIdAndUpdate(req.user.id, {
      $push: { addresses: newAddress._id }
    });

    res.status(201).json({ success: true, data: newAddress });
  } catch (error) {
    console.error("Add Address Error:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @route   GET /api/address
// @desc    Get all addresses for logged-in user
// @access  Private
export const getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: addresses });
  } catch (error) {
    console.error("Get Addresses Error:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @route   PUT /api/address/:id
// @desc    Update an address
// @access  Private
export const updateAddress = async (req, res) => {
  try {
    let address = await Address.findById(req.params.id);

    if (!address) {
      return res.status(404).json({ success: false, message: "Address not found" });
    }

    if (address.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: "Not authorized to update this address" });
    }

    address = await Address.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    res.status(200).json({ success: true, data: address });
  } catch (error) {
    console.error("Update Address Error:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @route   DELETE /api/address/:id
// @desc    Delete an address
// @access  Private
export const deleteAddress = async (req, res) => {
  try {
    const address = await Address.findById(req.params.id);

    if (!address) {
      return res.status(404).json({ success: false, message: "Address not found" });
    }

    if (address.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: "Not authorized to delete this address" });
    }

    await User.findByIdAndUpdate(req.user.id, {
      $pull: { addresses: req.params.id }
    });

    await address.deleteOne();

    res.status(200).json({ success: true, message: "Address removed" });
  } catch (error) {
    console.error("Delete Address Error:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
