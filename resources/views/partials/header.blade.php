<!--  Header Start -->
      <header class="app-header">
        <nav class="navbar navbar-expand-lg navbar-light">
          <ul class="navbar-nav">
            <li class="nav-item d-block d-xl-none">
              <a class="nav-link sidebartoggler nav-icon-hover" id="headerCollapse" href="javascript:void(0)">
                <i class="ti ti-menu-2"></i>
              </a>
            </li>
          </ul>
          <div class="navbar-collapse justify-content-end px-0" id="navbarNav">
            <ul class="navbar-nav flex-row ms-auto align-items-center justify-content-end">
                <li class="nav-item me-3 d-flex align-items-center">
                    <span class="fw-semibold">
                        {{ auth()->user()->name }}
                    </span>
                </li>

                <li class="nav-item dropdown">
                    <a class="nav-link nav-icon-hover" href="javascript:void(0)" id="drop2"
                        data-bs-toggle="dropdown" aria-expanded="false">
                        <img src="{{ asset('assets/images/profile/user-1.jpg') }}" alt="" width="35" height="35" class="rounded-circle">
                    </a>
                    <div class="dropdown-menu dropdown-menu-end dropdown-menu-animate-up" aria-labelledby="drop2">
                        <div class="message-body">
                            <form method="POST" action="{{ route('logout') }}" class="mx-3 mt-3">
                                @csrf
                                <button type="submit" class="btn btn-outline-primary w-100">
                                    Logout
                                </button>
                            </form>

                        </div>
                    </div>
                </li>
            </ul>
          </div>
        </nav>
      </header>
      <!--  Header End -->