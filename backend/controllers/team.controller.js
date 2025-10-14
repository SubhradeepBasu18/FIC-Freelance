import {AboutUs, TeamMember} from "../models/aboutUs.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// Add team member
// Update team member
// Delete team member
// Get team member

const addTeamMember = async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        message: "Avatar image is required",
      });
    }

    const { name, position, linkedin } = req.body;

    if (!name || !position || !linkedin) {
      // Clean up the uploaded file if validation fails
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    let aboutUs = await AboutUs.findOne({});
    if (!aboutUs) {
      aboutUs = new AboutUs({ team: [] });
    }

    const avatarLocalImgPath = req.file.path;
    
    // console.log('Uploading file from path:', avatarLocalImgPath);

    const avatarURL = await uploadOnCloudinary(avatarLocalImgPath);
    
    if (!avatarURL) {
      // Clean up the local file if Cloudinary upload fails
      if (fs.existsSync(avatarLocalImgPath)) {
        fs.unlinkSync(avatarLocalImgPath);
      }
      return res.status(500).json({
        message: "Failed to upload avatar to Cloudinary",
      });
    }

    const teamMember = { 
      name, 
      position, 
      linkedin, 
      avatar: avatarURL.url 
    };
    
    aboutUs.team.push(teamMember);
    await aboutUs.save();

    return res.status(201).json({
      message: "Team member added successfully",
      teamMember,
    });
  } catch (error) {
    console.error('Add team member error:', error);
    
    // Clean up uploaded file in case of error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    return res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
};
// team.controller.js - Update the updateTeamMember function
const updateTeamMember = async (req, res) => {
    try {
        const { name, position, linkedin } = req.body;
        const { id } = req.params;

        if (!name || !position || !linkedin) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        // Find the AboutUs document containing the team member
        const aboutUs = await AboutUs.findOne({ 'team._id': id });
        if (!aboutUs) {
            return res.status(404).json({
                message: "Team member not found"
            });
        }

        // Find the team member in the array
        const teamMemberIndex = aboutUs.team.findIndex((member) => member._id.toString() === id);
        if (teamMemberIndex === -1) {
            return res.status(404).json({
                message: "Team member not found"
            });
        }

        // Update basic fields
        aboutUs.team[teamMemberIndex].name = name;
        aboutUs.team[teamMemberIndex].position = position;
        aboutUs.team[teamMemberIndex].linkedin = linkedin;

        // Handle avatar update if a new file is provided
        const avatarLocalImgPath = req?.file?.path;
        if (avatarLocalImgPath) {
            const avatarURL = await uploadOnCloudinary(avatarLocalImgPath);
            if (!avatarURL) {
                return res.status(500).json({
                    message: "Failed to upload new avatar",
                });
            }
            aboutUs.team[teamMemberIndex].avatar = avatarURL.url;
        }

        await aboutUs.save();

        return res.status(200).json({
            message: "Team member updated successfully",
            teamMember: aboutUs.team[teamMemberIndex]
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

const deleteTeamMember = async (req, res) => {
    try {
      const { id } = req.params;
  
      // First, remove from the AboutUs document
      const aboutUs = await AboutUs.findOne({ 'team._id': id });
  
      if (!aboutUs) {
        return res.status(404).json({
          message: "About Us document or team member not found",
        });
      }
  
      // Find the team member and remove it from the array
      const teamMemberIndex = aboutUs.team.findIndex((member) => member._id.toString() === id);
  
      if (teamMemberIndex === -1) {
        return res.status(404).json({
          message: "Team member not found",
        });
      }
  
      // Remove the team member from the array
      const removedTeamMember = aboutUs.team.splice(teamMemberIndex, 1)[0];
  
      // Save the updated AboutUs document
      await aboutUs.save();
  
      // Optionally delete the team member from the TeamMember collection
      // If you're using a separate TeamMember collection
    //   await TeamMember.findByIdAndDelete(id);
  
      return res.status(200).json({
        message: "Team member deleted successfully",
        teamMember: removedTeamMember, // Return the deleted team member
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  };
  

const getTeamMemberById = async (req, res) => {
    try {
        const { id } = req.params;  // ID passed in the URL
        // const teamMember = await TeamMember.findById(id);
        const aboutUs = await AboutUs.findOne({ 'team._id': id });
        const teamMember = aboutUs.team.find((member) => member._id.toString() === id);

      if (!teamMember) {
        return res.status(404).json({
          message: "Team member not found",
        });
      }
  
      // Return the found team member
      return res.status(200).json({
        message: "Team member fetched successfully",
        teamMember,
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  };
  

const getAllTeamMembers = async (req, res) => {
    try {
      // Find the AboutUs document
      const aboutUs = await AboutUs.findOne({});
  
      // Check if the AboutUs document exists
      if (!aboutUs) {
        return res.status(404).json({
          message: "About Us document not found",
        });
      }
  
      // Return the team array from the AboutUs document
      return res.status(200).json({
        message: "Team members fetched successfully",
        team: aboutUs.team,
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  };
  

export { addTeamMember, updateTeamMember, deleteTeamMember, getTeamMemberById, getAllTeamMembers };
