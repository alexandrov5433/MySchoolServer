import Announcement from "../models/Announcement.js";

async function createNewAnnouncement(data) {
    return await Announcement.create(data);
}

async function deleteAnnouncementById(_id) {
    return await Announcement.findByIdAndDelete(_id);
}

export const announcementSrvice = {
    createNewAnnouncement,
    deleteAnnouncementById
}