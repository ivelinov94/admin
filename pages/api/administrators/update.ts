import { NextApiRequest, NextApiResponse } from "next";
import { UpdateAdministratorRequest } from "../../../interface";
import { withSessionRoute } from "../../../lib/withSession";
import Administrator from "../../../modules/Administrator";

async function updateRoute(req: NextApiRequest, res: NextApiResponse) {
    const { username, name, phone } = req.body as UpdateAdministratorRequest;

    if(!username || !name || !phone) {
        res.status(422).send({
            message: "Invalid information"
        });

        return;
    }

    const administratorRepo = new Administrator();
    const user = await administratorRepo.findUserByUsername(username);

    if(!user) {
        res.status(401).send({
            message: "User doesnt exists",
        });
        return;
    }

    const update = {
        ...user,
        phone: phone && phone !== user.phone ? phone : user.phone,
        name: name && name !== user.name ? name : user.name,
    };

    try {
        const createdUser = await administratorRepo.create({
            ...req.body,
            password: hashedPassword,
        });

        res.status(200).json({
            ...createdUser,
        });

    } catch(e) {
        console.error(e);
        res.status(500).json({
            message: "Problem",
        })
    }
};

export default withSessionRoute(updateRoute);
