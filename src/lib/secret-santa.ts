import api from "./api.js";

export async function blockApproval(token: string) {
    if (
        !confirm(
            "Block approval? This will lock the giver's submission and prevent staff from approving it without manually clearing the lock. This buys you time to reach out to staff with more information.",
        )
    )
        return;

    await api(token, `POST /secret-santa/block-approval`).catch(alert);
    alert("Approval has been blocked! Clicking this button again will not do anything further.");
}
