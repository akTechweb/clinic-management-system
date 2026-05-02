from rest_framework.permissions import BasePermission



class IsAdmin(BasePermission):
    """
    Allows access only to Admin group users.
    """

    def has_permission(self, request, view):
       
        return (
            request.user and
            request.user.is_authenticated and
            request.user.groups.filter(name="admin").exists()
        )


class IsDoctor(BasePermission):
    """
    Allows access only to Doctor group users.
    """

    def has_permission(self, request, view):
        return (
            request.user and
            request.user.is_authenticated and
            request.user.groups.filter(name="doctor").exists()
        )


class IsLabTechnician(BasePermission):
    """
    Allows access only to LabTechnician group users.
    """

    def has_permission(self, request, view):
        return (
            request.user and
            request.user.is_authenticated and
            request.user.groups.filter(name="labtechnician").exists()
        )


class IsPharmacist(BasePermission):
    """
    Allows access only to Pharmacist group users.
    """

    def has_permission(self, request, view):
        return (
            request.user and
            request.user.is_authenticated and
            request.user.groups.filter(name="pharmacist").exists()
        )


class IsReceptionist(BasePermission):
    """
    Allows access only to Receptionist group users.
    """

    def has_permission(self, request, view):
        return (
            request.user and
            request.user.is_authenticated and
            request.user.groups.filter(name="receptionist").exists()
        )
    
# from rest_framework.permissions import BasePermission

# from rest_framework.permissions import BasePermission

# class IsDoctorOrReceptionist(BasePermission):
#     def has_permission(self, request, view):
#         user = request.user

#         if not user or not user.is_authenticated:
#             return False

#         # SAFE role access
#         role = getattr(user, "role", None)

#         return role in ["Doctor", "Receptionist"]

