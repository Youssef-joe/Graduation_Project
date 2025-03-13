const Menu = require("./../models/menuModel.js");

let addItem = async (req, res) => {
  try {
    const { title, description, price, category, imageSrc } = req.body;

    if (!title || !description || !price || !category || !imageSrc) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (price < 0) {
            return res.status(400).json({
        message: "Price cannot be negative",
      });
        }

        const newItem = new Menu({
      title,
      description,
            price,
      category,
      imageSrc,
    });

    const savedItem = await newItem.save();
    res.status(201).json({
      message: "Menu item added successfully",
      item: savedItem,
    });
  } catch (error) {
    console.error("Error adding menu item:", error);
        res.status(500).json({
      message: "Failed to add menu item",
      error: error.message,
    });
  }
};

let updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, category, imageSrc, isAvailable } =
      req.body;

    const item = await Menu.findById(id);
    if (!item) {
      return res.status(404).json({
        message: "Menu item not found",
      });
    }

    if (title) item.title = title;
    if (description) item.description = description;
    if (price !== undefined) {
      if (price < 0) {
            return res.status(400).json({
          message: "Price cannot be negative",
        });
      }
      item.price = price;
    }
    if (category) item.category = category;
    if (imageSrc) item.imageSrc = imageSrc;
    if (isAvailable !== undefined) item.isAvailable = isAvailable;

    const updatedItem = await item.save();
    res.status(200).json({
      message: "Menu item updated successfully",
      item: updatedItem,
    });
  } catch (error) {
    console.error("Error updating menu item:", error);
    res.status(500).json({
      message: "Failed to update menu item",
      error: error.message,
    });
  }
};

let deleteItem = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedItem = await Menu.findByIdAndDelete(id);

    if (!deletedItem) {
      res.status(404).json({
        message: "Menu item not found",
      });
        }

        res.status(200).json({
      message: "Menu item deleted successfully",
      item: deletedItem,
    });
  } catch (error) {
    console.error("Error deleting menu item:", error);
        res.status(500).json({
      message: "Failed to delete menu item",
      error: error.message,
    });
  }
};

let getMenu = async (req, res) => {
  try {
    const { category } = req.query;
    const query = category && category !== "All" ? { category } : {};
    const menuItems = await Menu.find(query).sort({ category: 1, title: 1 });
    res.status(200).json(menuItems);
  } catch (error) {
    console.error("Error fetching menu:", error);
    res.status(500).json({
      message: "Failed to fetch menu items",
      error: error.message,
    });
  }
};

let getMenuByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const menuItems = await Menu.find({ category }).sort({ title: 1 });
    res.status(200).json(menuItems);
  } catch (error) {
    console.error("Error fetching menu by category:", error);
            res.status(500).json({
      message: "Failed to fetch menu items",
      error: error.message,
    });
  }
};

let toggleAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Menu.findById(id);

    if (!item) {
      return res.status(404).json({
        message: "Menu item not found",
      });
    }

    item.isAvailable = !item.isAvailable;
    const updatedItem = await item.save();

    res.status(200).json({
      message: `Menu item ${
        item.isAvailable ? "enabled" : "disabled"
      } successfully`,
      item: updatedItem,
    });
  } catch (error) {
    console.error("Error toggling menu item availability:", error);
    res.status(500).json({
      message: "Failed to toggle menu item availability",
      error: error.message,
    });
  }
};

module.exports = {
    addItem,
    updateItem,
    deleteItem,
  getMenu,
  getMenuByCategory,
  toggleAvailability,
};
