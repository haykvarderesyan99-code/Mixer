export const filterPrivateAccountData = (followModel) => {
    return async (req, res, next) => {
        // Store original send function
        const originalSend = res.send.bind(res);

        // Override send function
        res.send = async function(data) {
            // Restore original send to prevent infinite recursion
            res.send = originalSend;

            try {
                // Parse data if it's a string
                let responseData = typeof data === 'string' ? JSON.parse(data) : data;

                // Check if response contains user data
                if (responseData && responseData.user) {
                    const user = responseData.user;
                    
                    // Check if the user account is private
                    if (user.isAccountPrivate === true || user.isAccountPrivate === 1 || user.isAccountPrivate === "1") {
                        const requestingUserId = req.user?.id;
                        const profileUserId = user.id;

                        // If requesting their own profile, show all data
                        if (requestingUserId && requestingUserId === profileUserId) {
                            return res.send(data);
                        }

                        // Check if the requesting user is following the private account
                        let isFollowing = false;
                        if (requestingUserId) {
                            const followRelation = await followModel.findOne({
                                where: {
                                    from: requestingUserId,
                                    to: profileUserId,
                                    approved: true
                                }
                            });
                            isFollowing = !!followRelation;
                        }

                        // If not following (or not authenticated), hide sensitive data
                        if (!isFollowing) {
                            // Keep only basic public info and set sensitive data to empty arrays
                            responseData.user = {
                                id: user.id,
                                firstName: user.firstName,
                                lastName: user.lastName,
                                username: user.username,
                                isAccountPrivate: user.isAccountPrivate,
                                avatar: user.avatar || '',
                                bio: user.bio || '',
                                theme: user.theme || 'light',
                                posts: [],
                                followers: [],
                                followings: []
                            };
                        }
                    }
                }

                // Send the modified response
                return res.send(responseData);
            } catch (error) {
                // If there's an error, send the original data
                console.error('Privacy middleware error:', error);
                return res.send(data);
            }
        };

        next();
    };
};
