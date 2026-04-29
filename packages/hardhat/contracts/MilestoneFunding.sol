// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract MilestoneFunding {
    enum ProjectStatus {
        Active,
        Completed,
        Cancelled
    }

    struct Project {
        address payable creator;
        address funder;
        string title;
        uint256 totalAmount;
        uint256 releasedAmount;
        uint256 milestoneCount;
        uint256 completedMilestones;
        ProjectStatus status;
    }

    uint256 public projectCounter;

    mapping(uint256 => Project) public projects;
    mapping(uint256 => mapping(uint256 => bool)) public milestoneReleased;

    event ProjectCreated(uint256 indexed projectId, address indexed creator, string title, uint256 milestoneCount);
    event ProjectFunded(uint256 indexed projectId, address indexed funder, uint256 amount);
    event MilestoneReleased(uint256 indexed projectId, uint256 milestoneIndex, uint256 amount);
    event ProjectCancelled(uint256 indexed projectId);

    function createProject(string memory _title, uint256 _milestoneCount) external {
        require(bytes(_title).length > 0, "Title is required");
        require(_milestoneCount > 0, "Milestone count must be greater than zero");

        projectCounter++;

        projects[projectCounter] = Project({
            creator: payable(msg.sender),
            funder: address(0),
            title: _title,
            totalAmount: 0,
            releasedAmount: 0,
            milestoneCount: _milestoneCount,
            completedMilestones: 0,
            status: ProjectStatus.Active
        });

        emit ProjectCreated(projectCounter, msg.sender, _title, _milestoneCount);
    }

    function fundProject(uint256 _projectId) external payable {
        Project storage project = projects[_projectId];

        require(project.creator != address(0), "Project does not exist");
        require(project.status == ProjectStatus.Active, "Project is not active");
        require(msg.value > 0, "Funding amount must be greater than zero");
        require(project.funder == address(0), "Project already funded");
        require(msg.sender != project.creator, "Creator cannot fund own project");

        project.funder = msg.sender;
        project.totalAmount = msg.value;

        emit ProjectFunded(_projectId, msg.sender, msg.value);
    }

    function releaseMilestone(uint256 _projectId, uint256 _milestoneIndex) external {
        Project storage project = projects[_projectId];

        require(project.creator != address(0), "Project does not exist");
        require(msg.sender == project.funder, "Only funder can release milestone");
        require(project.status == ProjectStatus.Active, "Project is not active");
        require(_milestoneIndex < project.milestoneCount, "Invalid milestone");
        require(!milestoneReleased[_projectId][_milestoneIndex], "Milestone already released");

        uint256 milestoneAmount = project.totalAmount / project.milestoneCount;

        milestoneReleased[_projectId][_milestoneIndex] = true;
        project.completedMilestones++;
        project.releasedAmount += milestoneAmount;

        if (project.completedMilestones == project.milestoneCount) {
            project.status = ProjectStatus.Completed;

            uint256 remainingBalance = project.totalAmount - project.releasedAmount;
            milestoneAmount += remainingBalance;
            project.releasedAmount = project.totalAmount;
        }

        project.creator.transfer(milestoneAmount);

        emit MilestoneReleased(_projectId, _milestoneIndex, milestoneAmount);
    }

    function cancelProject(uint256 _projectId) external {
        Project storage project = projects[_projectId];

        require(project.creator != address(0), "Project does not exist");
        require(msg.sender == project.creator, "Only creator can cancel");
        require(project.funder == address(0), "Cannot cancel funded project");
        require(project.status == ProjectStatus.Active, "Project is not active");

        project.status = ProjectStatus.Cancelled;

        emit ProjectCancelled(_projectId);
    }

    function getProject(uint256 _projectId) external view returns (Project memory) {
        return projects[_projectId];
    }
}
