const CommentModel = require("../models/comments");
const { uploadFile } = require("../libs/storage");

class Comments {
    async create(idTask, idUser, data, file) {
        let uploaded;
        if (file) {
            uploaded = await uploadFile(file?.originalname, file?.buffer);
        }
        if (uploaded?.success) {
            const newComment = {
                idTask,
                idUser,
                file: "/files/" + uploaded.fileName,
                fileKey: uploaded.fileName,
                ...data,
            };
            const comment = await CommentModel.create(newComment);

            return comment;
        } else {
            const newComment = { ...data, idUser, idTask };
            const comment = await CommentModel.create(newComment);
            return comment;
        }
    }
    async update(id, data) {
        const result = await CommentModel.findByIdAndUpdate(id, data, {
            new: true,
        });

        return result;
    }

    async delete(id) {
        const result = await CommentModel.findByIdAndDelete(id);

        return result;
    }
}

module.exports = Comments;
