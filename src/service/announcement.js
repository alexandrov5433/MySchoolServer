import Announcement from "../models/Announcement.js";

async function createNewAnnouncement(data) {
    return await Announcement.create(data);
}

export const announcementSrvice = {
    createNewAnnouncement
}