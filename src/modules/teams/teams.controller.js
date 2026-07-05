import Team from './team.model.js';

export async function createTeam(req, res, next) {
  try {
    const { name, description } = req.body;
    const owner = req.user._id;
    const team = await Team.create({ name, description, owner, members: [owner] });
    res.status(201).json({ success: true, data: team });
  } catch (err) { next(err); }
}

export async function addMember(req, res, next) {
  try {
    const { id } = req.params;
    const { memberId } = req.body;
    const team = await Team.findById(id);
    if (!team) return res.status(404).json({ success: false, message: 'Team not found' });
    if (String(team.owner) !== String(req.user._id) && req.user.role !== 'admin') return res.status(403).json({ success: false, message: 'Forbidden' });
    if (!team.members.includes(memberId)) team.members.push(memberId);
    await team.save();
    res.json({ success: true, data: team });
  } catch (err) { next(err); }
}

export async function listTeams(req, res, next) {
  try {
    const teams = await Team.find().populate('owner members', 'name email');
    res.json({ success: true, data: teams });
  } catch (err) { next(err); }
}
