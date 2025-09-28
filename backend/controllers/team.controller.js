import {AboutUs, TeamMember} from "../models/aboutUs.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// Add team member
// Update team member
// Delete team member
// Get team member


const addTeamMember = async (req, res) => {
  try {
    const { name, position, linkedin} = req.body;

    if (!name || !position || !linkedin) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    let aboutUs = await AboutUs.findOne({});
    if (!aboutUs) {
      aboutUs = new AboutUs({ team: [] });
    }

    const avatarLocalImgPath = req?.file?.path;
    
    if(!avatarLocalImgPath) {
        return res.status(400).json({
            message: "Avatar is required",
        })
    }

    const avatarURL = await uploadOnCloudinary(avatarLocalImgPath);
    if(!avatarURL) {
        return res.status(500).json({
            message: "Failed to upload avatar",
        })
    }

    const teamMember = { name, position, linkedin, avatar: avatarURL.url };
    aboutUs.team.push(teamMember);

    await aboutUs.save();

    return res.status(201).json({
      message: "Team member added successfully",
      teamMember,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const updateTeamMember = async(req, res) => {
    try {
        
        const {name, position, linkedin} = req.body;
        
        const teamMember = await TeamMember.findById(req.params.id)
        if(!teamMember) {
            return res.status(404).json({
                message: "Team member not found"
            })
        }

        teamMember.name = name;
        teamMember.position = position;
        teamMember.linkedin = linkedin;

        await teamMember.save();

        return res.status(200).json({
            message: "Team member updated successfully",
            teamMember
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message,
        })
    }
}

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
