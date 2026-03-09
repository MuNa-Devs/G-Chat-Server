
// UMS -> Universal Message Structure
// Imposed structure: {
//  identifiers: {...},
//  sender_details: {...},
//  text: "...",
//  files_list: [...],
//  timestamp: "...{UTC}"
// }

export default class UMS {

    static globalMessage(object){
        const message = {
            identifiers: {
                message_id: object.id
            },
            sender_details: {
                sender_id: object.user_id,
                sender_name: object.username,
                sender_pfp: object.pfp
            },
            text: object.message,
            files_list: object.files,
            timestamp: object.created_at
        };

        return message;
    }

    static roomMessage(object) {
        const message = {
            identifiers: {
                message_id: object.message_id,
                room_id: object.r_id
            },
            sender_details: {
                sender_id: object.user_id,
                sender_name: object.username,
                sender_pfp: object.pfp
            },
            text: object.message,
            files_list: object.files,
            timestamp: object.sent_at
        };

        return message;
    }

    static directMessage(object){
        const message = {
            identifiers: {
                contact_id: object.contact_id,
                message_id: object.message_id
            },
            sender_details: {
                sender_id: object.user_id,
                sender_name: object.username,
                sender_pfp: object.pfp
            },
            text: object.message,
            files_list: object.files,
            timestamp: object.sent_at
        };

        return message;
    }
}