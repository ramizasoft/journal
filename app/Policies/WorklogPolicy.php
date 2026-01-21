<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Worklog;

class WorklogPolicy
{
    /**
     * Determine whether the user can view the worklog.
     */
    public function view(User $user, Worklog $worklog): bool
    {
        return $user->id === $worklog->user_id;
    }

    /**
     * Determine whether the user can update the worklog.
     */
    public function update(User $user, Worklog $worklog): bool
    {
        return $user->id === $worklog->user_id;
    }

    /**
     * Determine whether the user can delete the worklog.
     */
    public function delete(User $user, Worklog $worklog): bool
    {
        return $user->id === $worklog->user_id;
    }
}
